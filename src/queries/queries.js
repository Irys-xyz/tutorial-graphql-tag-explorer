import { gql } from "apollo-boost";

// query a variable number of pngs
export const GET_PNG = gql`
	query GetPNGs($numImages: Int) {
		transactions(
			first: $numImages
			tags: { name: "Content-Type", values: ["image/png"] }
		) {
			edges {
				node {
					id
				}
			}
		}
	}
`;

// get exactly 10 pngs
export const GET_PNG_10 = gql`
	query GetPNGs {
		transactions(
			first: 10
			tags: { name: "Content-Type", values: ["image/png"] }
		) {
			edges {
				node {
					id
				}
			}
		}
	}
`;
