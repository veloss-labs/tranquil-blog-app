import { type NextPage } from "next";
import SubNav from "~/components/shared/layouts/SubNav";
import Contents from "~/components/shared/layouts/Contents";
import Layout from "~/components/shared/layouts/Layout";
import PostList from "~/components/shared/common/PostList";

const Home: NextPage = () => {
  return (
    <Layout>
      <Contents subNav={<SubNav />} hasFlushed>
        <PostList />
      </Contents>
    </Layout>
  );
};

export default Home;
