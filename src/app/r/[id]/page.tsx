import { notFound, redirect } from "next/navigation";
import { generateTitle } from "src/utils/metadata";

import redirects from "../../../../contents/redirects.json";

interface Props {
  params: Promise<{ id: string }>;
}

const getTarget = (id: string) => {
  return redirects.find((x) => x.id === id);
};

export const generateMetadata = async (props: Props) => {
  const params = await props.params;

  const {
    id,
  } = params;

  const target = getTarget(id);

  if (!target) {
    return {};
  }

  return {
    title: generateTitle("Redirecting to " + target.id),
  };
};

export default async function RedirectPage(props: Props) {
  const params = await props.params;

  const {
    id,
  } = params;

  const target = getTarget(id);

  if (target) {
    redirect(target.to);
  }
  else {
    notFound();
  }
}

export function generateStaticParams() {
  return redirects.map((x) => ({ id: x.id }));
}
