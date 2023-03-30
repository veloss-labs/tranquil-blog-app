import SubNav from "~/components/shared/layouts/SubNav";
import Contents from "~/components/shared/layouts/Contents";
import Layout from "~/components/shared/layouts/Layout";
import PostList from "~/components/shared/common/PostList";
import type { GetServerSidePropsContext } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const message = await serverSideTranslations(ctx.locale ?? "ko", ["common"]);

  return {
    props: {
      ...message,
    },
  };
}

export default function Home() {
  return (
    <Layout>
      <Contents subNav={<SubNav />} hasFlushed>
        <PostList />
      </Contents>
    </Layout>
  );
}
