export let corsHeader = {
    'Access-Control-Allow-Origin': '*'
};

export function resolveUrl(base: string, rel: string) {
    if (base.endsWith('/')) {
        return base + rel;
    } else {
        return base + "/../" + rel;
    }
}