import type { SchematizedTuple } from "~/Core/Tuple/SchematizedTuple";
import type { SchematizedImplementation } from "~/Types/Function/SchematizedImplementation";

interface OverloadBranch {
    schema: SchematizedTuple<any>;
    implementation: SchematizedImplementation<any, any, any>;
}

export type { OverloadBranch };
