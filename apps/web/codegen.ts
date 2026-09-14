import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "http://localhost:4200/graphql/",
  documents: ["src/**/*.tsx"],
};
