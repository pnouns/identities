import { FlagDefinition, FlagFileDefinition, StripeWithHeight } from "@idfyi/dto";

export const rowCounts = [
  // 3
  5,
  6,
  7,
  8,
];

// Call it inefficient/lazy, but it works.
const height = rowCounts.reduce((a, b) => a * b, 10);

function getStripes(flag: FlagDefinition): (string | StripeWithHeight)[] {
  if(!flag) {
    throw new ReferenceError("No flag provided.");
  }
  if(flag.stripes) {
    return flag.stripes;
  } else if(flag["uneven stripes"]) {
    return flag["uneven stripes"];
  }
  throw new ReferenceError(`Flag did not provide any stripes.`);
}

function getStripeHeight(stripeCount: number, stripe: string | StripeWithHeight): number {
  if(typeof stripe === "string") {
    return Math.ceil(height / stripeCount);
  }
  return Math.ceil(height * stripe.height);
}

export function buildSquareSVGFlag(flag: FlagDefinition): string {
  const stripes = getStripes(flag);
  const stripeCount = stripes.length;
  let startIndex = 0;
  const stripeDefs = stripes.map((stripe, i) => {
    const stripeHeight = getStripeHeight(stripeCount, stripe);
    const color = typeof stripe === "string" ? stripe : stripe.color;
    const def = `<rect fill="#${color}" width="100%" height="${stripeHeight}" y="${startIndex}" x="0" />`;
    startIndex += stripeHeight;
    return def;
  });
  return `\
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${height} ${height}">
${stripeDefs.join("\n")}
</svg>
`;
}

export function buildRectangleSVGFlag(flag: FlagDefinition): string {
  const stripes = getStripes(flag);
  const stripeCount = stripes.length;
  let startIndex = 0;
  const stripeDefs = stripes.map((stripe, i) => {
    const stripeHeight = getStripeHeight(stripeCount, stripe);
    const color = typeof stripe === "string" ? stripe : stripe.color;
    const def = `<rect fill="#${color}" width="100%" height="${stripeHeight}" y="${startIndex}" x="0" />`;
    startIndex += stripeHeight;
    return def;
  });
  return `\
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${height * 5 / 3} ${height}">
${stripeDefs.join("\n")}
</svg>
`;
}

