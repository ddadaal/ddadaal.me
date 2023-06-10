import { notFound, redirect } from "next/navigation";
import { generateTitle } from "src/utils/metadata";

import redirects from "../../../../contents/redirects.json";

interface Props {
  params: { id: string }
}

const getTarget = (id: string) => {
  return redirects.find((x) => x.id === id);
};

export const generateMetadata = ({ params: { id } }: Props) => {

  const target = getTarget(id);

  if (!target) { return {}; }

  return {
    title: generateTitle("Redirecting to " + target.id),
  };
};

export default function RedirectPage({
  params: { id },
}: Props) {
  const target = getTarget(id);

  if (target) {
    redirect(target.to);
  } else {
    notFound();
  }
}

export async function generateStaticParams() {
  return redirects.map((x) => ({ id: x.id }));
}
