export const camelCaseToTitleCase = (str: string) => {
    return str.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
};

export const trimToLength = (str: string, length: number) => {
    return str.length > length ? str.substring(0, length) + "..." : str;
};
