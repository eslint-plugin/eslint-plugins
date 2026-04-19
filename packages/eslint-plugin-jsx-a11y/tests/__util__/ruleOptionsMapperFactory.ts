type ESLintTestRunnerTestCase = {
  code: string;
  errors?: Array<{ message: string; type: string }>;
  options?: Array<unknown>;
  parserOptions?: Array<unknown>;
  settings?: { [string: string]: unknown };
};

type RuleOptionsMapperFactoryType = (
  params: ESLintTestRunnerTestCase,
) => ESLintTestRunnerTestCase;

export default function ruleOptionsMapperFactory(
  ruleOptions: Array<unknown> = [],
): RuleOptionsMapperFactoryType {
  // eslint-disable-next-line
  return ({
    code,
    errors,
    options,
    parserOptions,
    settings,
  }: ESLintTestRunnerTestCase): ESLintTestRunnerTestCase => {
    return {
      code,
      errors,
      // Flatten the array of objects in an array of one object.
      options: [
        Object.fromEntries(
          (options || [])
            .concat(ruleOptions)
            .flatMap((item) => Object.entries(item)),
        ),
      ],
      parserOptions,
      settings,
    };
  };
}
