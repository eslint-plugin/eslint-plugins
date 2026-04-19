export type JSXExpressionContainerMockType<T> = {
  type: "JSXExpressionContainer";
  expression: T;
};

export default function JSXExpressionContainerMock<T>(
  exp: T,
): JSXExpressionContainerMockType<T> {
  return {
    type: "JSXExpressionContainer",
    expression: exp,
  };
}
