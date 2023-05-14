export default function (plop) {
  // create your generators here
  plop.setGenerator("component", {
    description: "Lets generate Component",
    prompts: [
      {
        type: "rawlist",
        choices: ["atoms", "molecules", "organisms", "sections", "pages"],
        name: "componenttype",
        message: "What is the type of Component",
      },
      {
        type: "input",
        name: "componentname",
        message: "What will be the name of component",
      },
    ], // array of inquirer prompts
    actions: [
      {
        type: "add",
        path: "src/components/UI/{{componenttype}}/{{pascalCase componentname}}/{{pascalCase componentname}}.tsx",
        templateFile: "plopTemplate/component.tsx.hbs",
      },
      {
        type: "add",
        path: "src/components/UI/{{componenttype}}/{{pascalCase componentname}}/index.ts",
        templateFile: "plopTemplate/index.ts.hbs",
      },
      {
        path: "src/components/UI/{{componenttype}}/index.ts",
        pattern: /(\/\/ COMPONENT IMPORTS)/g,
        template:
          "import {{pascalCase componentname}} from './{{pascalCase componentname}}';\n$1",
        type: "modify",
      },
      {
        path: "src/components/UI/{{componenttype}}/index.ts",
        pattern: /(\/\/ COMPONENT EXPORTS)/g,
        template: "{{pascalCase componentname}},\n$1",
        type: "modify",
      },
    ], // array of actions
  });
}
