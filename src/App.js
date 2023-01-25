import { useState, useEffect } from "react";
import ApolloClient from "apollo-boost";
import { useApolloClient } from "@apollo/client";
import { useQuery, gql } from "@apollo/client";

import { GET_PNG } from "./queries/queries.js";
import { GET_PNG_10 } from "./queries/queries.js";

export default function App() {
	const [message, setMessage] = useState("");
	const [numImages, setNumImages] = useState(10);
	const [images, setImages] = useState([]);
	const client = useApolloClient();

	// called on page load (component render)
	const { loading, error, data } = useQuery(GET_PNG_10);

	// load the initial 10
	useEffect(() => {
		if (!loading) {
			const edges = data.transactions.edges;
			const allUrls = [];
			for (let i = 0; i < edges.length; i++) {
				allUrls.push("https://arweave.net/" + edges[i].node.id);
			}
			setImages(allUrls);
		}
	}, data);

	// this query is used for display purposes only
	// helps educate the viewer about GraphQl
	let queryForDisplay = `query {
		transactions(first: ${numImages},
			tags: {
				name: "Content-Type",
				values: ["image/png"]
			}
		) {
			edges {
				node {
					id
				}
			}
		}
	};`;

	// called when the user clicks "query"
	const doQuery = async () => {
		// clear existing images
		setImages([]);
		// get new ones
		try {
			setMessage("Starting query");
			// Call parseInt on the numImages variable, otherwise JS thinks it's a string
			console.log("Starting query numImages=", numImages);
			const response = await client.query({
				query: GET_PNG,
				variables: { numImages: parseInt(numImages) },
			});
			setMessage("Query done");

			// pull out the transaction ids to use in img tags
			const edges = response.data.transactions.edges;
			const allUrls = [];
			for (let i = 0; i < edges.length; i++) {
				allUrls.push("https://arweave.net/" + edges[i].node.id);
			}
			setImages(allUrls);
		} catch (e) {
			setMessage("Query error ", e);
		}
	};

	return (
		<div className="bg-[#FEF4EE] h-screen">
			<h1 className="pt-10 pl-10 text-3xl font-mono font-bold underline">
				Arweave Blockweave Explorer
			</h1>
			<div>
				<p className="pt-1 pl-10 w-2/3 font-mono">
					Example app to teach using GraphQL to query the Arweave
					Blockweave. Queries for n most recent pngs posted to Arweave
					and displays them below. Modify the query using the left
					side of the screen, view the query results on the right. For
					more info:
				</p>
				<ul className="list-disc mt-2 ml-5 pl-10">
					<li>
						<a
							className="underline"
							href="https://gql-guide.vercel.app/"
							target="_blank"
						>
							Arweave GraphQL Documentation
						</a>
					</li>
					<li>
						<a
							className="underline"
							href="https://arweave.net/graphql"
							target="_blank"
						>
							Arweave GraphQL Playground
						</a>
					</li>
					<li>
						<a
							className="underline"
							href="https://docs.bundlr.network/tutorials/graphql-explorer"
							target="_blank"
						>
							Tutorial For This Project
						</a>
					</li>
				</ul>
			</div>
			<div className="flex flex-row pt-10 pl-10" id="title-area">
				<div className="w-1/3" id="query-configurer">
					<span className="flex flex-col">
						<label className="font-bold">
							Number of images to retrieve: {numImages}{" "}
						</label>
						<input
							id="default-range"
							type="range"
							min="10"
							max="100"
							value={numImages}
							onChange={(e) => setNumImages(e.target.value)}
							className="mt-2 w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
						/>
					</span>

					<textarea
						id="queryForDisplay"
						rows="14"
						className="mt-5 p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						readOnly
						value={queryForDisplay}
					></textarea>
					<button
						className="mt-5 bg-black hover:bg-blue-700 text-[#FEF4EE] rounded px-4 py-1 font-bold"
						onClick={doQuery}
					>
						query
					</button>
					<p className="font-bold">{message}</p>
				</div>
				<div className="flex flex-col"></div>
				<div
					className="w-2/3 flex flex-wrap ml-2 mr-2 border border-3 border-black"
					id="query-results"
				>
					{images.map((image, id) => {
						return (
							<a
								href={image}
								target="_blank"
								className="underline"
							>
								<img
									className="mx-1 my-1"
									width="200"
									height="200"
									src={image}
									key={id}
								/>
							</a>
						);
					})}
				</div>
			</div>
		</div>
	);
}
