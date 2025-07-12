
export function entriesTOMarkdown(entries, type) {
  if (!entries?.length) return "";
  return (
    `## ${type}\n\n` +
    entries
      .map((entry) => {
        const dataRange = entry.current
          ? `${entry.startDate} - Present`
          : `${entry.startDate} - ${entry.endDate}`;
        return `### ${entry.title} @ ${entry.organization}\n\n**${dataRange}**\n\n${entry.description}`;
      })
      .join("\n\n")
  );
}
