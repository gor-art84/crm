import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "../api/schema.gql",
  documents: ["src/**/*.{ts,tsx}"],
  generates: {
    "./src/generated/": {
      preset: "client",
      presetConfig: {
        gqlTagName: "gql",
      },
      config: {
        scalars: {
          DateTime: "string",
        },
        strictScalars: true,
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
