export interface AmbassadorVerification {
  name: string;
  role: "Claude Community Ambassador";
  sourceUrl: string;
  verifiedAt: string;
}

const ambassadors: Readonly<Record<string, AmbassadorVerification>> = {
  "701302536": {
    name: "高見龍",
    role: "Claude Community Ambassador",
    sourceUrl: "https://kaochenlong.com/build-your-own-claude-code",
    verifiedAt: "2026-10-18",
  },
  "627625202": {
    name: "林楓",
    role: "Claude Community Ambassador",
    sourceUrl: "https://luma.com/claude-taipei-10",
    verifiedAt: "2026-10-18",
  },
  "100002197226424": {
    name: "蕭晊莛",
    role: "Claude Community Ambassador",
    sourceUrl:
      "https://www.digitimes.com.tw/seminar/DevDaysAsia2026/speakers_en.html",
    verifiedAt: "2026-10-18",
  },
};

/** Returns first-party role evidence for an exact author ID, or undefined if unverified. */
export function getAmbassadorVerification(
  authorId: string,
): AmbassadorVerification | undefined {
  return Object.hasOwn(ambassadors, authorId)
    ? ambassadors[authorId]
    : undefined;
}
