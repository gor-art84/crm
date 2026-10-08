export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-enum": [
      2,
      "always",
      [
        "api",
        "web",
        "auth",
        "clients",
        "users",
        "dadata",
        "db",
        "redis",
        "config",
        "deps",
        "docker",
        "ci",
        "tooling",
      ],
    ],
  },
};
