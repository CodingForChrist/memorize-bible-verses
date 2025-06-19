export function getTemplate(templateId: string) {
  const template = document.querySelector<HTMLTemplateElement>(
    `#${templateId}`,
  );

  if (template === null) {
    throw new Error(`Cannot find template "${templateId}"`);
  }

  return template.content.cloneNode(true) as DocumentFragment;
}
