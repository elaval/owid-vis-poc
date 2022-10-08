export namespace worldTopojson {
    const type: string;
    namespace objects {
        namespace world {
            const type_1: string;
            export { type_1 as type };
            export const geometries: ({
                type: string;
                arcs: number[][];
                id: string;
            } | {
                type: string;
                arcs: number[][][];
                id: string;
            })[];
        }
    }
    const arcs: number[][][];
    const bbox: number[];
}
