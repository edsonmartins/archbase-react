declare const AND: ";";
declare const OR: ",";
declare const AND_VERBOSE: "and";
declare const OR_VERBOSE: "or";
declare const CanonicalLogicOperators: (";" | ",")[];
type CanonicalLogicOperator = (typeof CanonicalLogicOperators)[number];
declare const VerboseLogicOperators: ("and" | "or")[];
type VerboseLogicOperator = (typeof VerboseLogicOperators)[number];
declare const LogicOperators: (";" | "," | "and" | "or")[];
type LogicOperator = (typeof LogicOperators)[number];
declare function isLogicOperator(candidate: string, operator?: LogicOperator): candidate is LogicOperator;
export { AND, OR, AND_VERBOSE, OR_VERBOSE, CanonicalLogicOperators, VerboseLogicOperators, LogicOperators, isLogicOperator };
export type { CanonicalLogicOperator, VerboseLogicOperator, LogicOperator };
//# sourceMappingURL=LogicOperator.d.ts.map