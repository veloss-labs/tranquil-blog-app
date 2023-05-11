import {
  Card,
  Form,
  Input,
  Table,
  Space,
  Button,
  Divider,
  Row,
  Breadcrumb,
  Col,
  Tag,
  type TablePaginationConfig,
} from "antd";
import React, { useCallback, useEffect, useMemo } from "react";
import DashboardLayout from "~/components/dashboard/DashboardLayout";
import { SearchOutlined } from "@ant-design/icons";
import { useMedia } from "~/libs/hooks/useMedia";
import { useResetUrlState, useUrlState } from "~/libs/hooks/useUrlState";
import { useRouter } from "next/router";
import {
  AuthMode,
  getServerAuthSession,
  getServerAuthValidation,
} from "~/server/auth";

import type { GetServerSidePropsContext } from "next";
import { useMemoizedFn } from "ahooks";
import { api } from "~/utils/api";
import { isString } from "~/utils/assertion";
import { computedTableIndex } from "~/utils/utils";
import dayjs from "dayjs";
import { logger } from "~/utils/logger";
import { PostsSearch } from "~/libs/search/posts";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

interface FormFields {
  keyword: string;
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getServerAuthSession(ctx);
  const result = getServerAuthValidation(session, AuthMode.CREATOR);

  if (result.redirect) {
    return result;
  }

  const message = await serverSideTranslations(ctx.locale ?? "ko", ["common"]);

  return {
    props: {
      session,
      ...message,
    },
  };
}

export default function Posts() {
  const defaultQuery = useMemo(
    () => ({
      pageNo: "1",
      pageSize: "10",
      keyword: "",
    }),
    []
  );

  const router = useRouter();

  const [state, setState] = useUrlState(defaultQuery);

  const reset = useResetUrlState();

  const isMobile = useMedia("(max-width: 768px)", false);
  const colSpan = useMemo(() => (isMobile ? 24 : 12), [isMobile]);

  const _search = useMemo(() => {
    const _instance = new PostsSearch<FormFields>({
      initialQuery: defaultQuery,
    });
    return _instance;
  }, [defaultQuery]);

  const page = isString(state.pageNo) ? parseInt(state.pageNo, 10) : 1;
  const pageSize = isString(state.pageSize) ? parseInt(state.pageSize, 10) : 10;

  const query = api.posts.pages.useQuery(
    {
      page,
      pageSize,
      keyword: state.keyword,
    },
    {
      staleTime: Infinity,
      onError: (error) => {
        logger.error("[dashboard - posts] pages error", error);
      },
    }
  );

  const data = useMemo(() => {
    const _data = query.data?.data;
    return {
      list: _data?.list ?? [],
      total: _data?.totalCount ?? 0,
    };
  }, [query]);

  const [form] = Form.useForm<FormFields>();

  const onFinish = useCallback(
    (input: FormFields) => {
      const nextInput = { ...input, pageNo: "1", pageSize: state.pageSize };
      const query = _search.makeQuery(nextInput);
      setState(query);
    },
    [_search, setState, state.pageSize]
  );

  const onReset: React.FormEventHandler<HTMLFormElement> = useCallback(() => {
    reset();
    form.resetFields();
  }, [form, reset]);

  const onRowClick = useCallback(
    (postId: number) => {
      router.push(`/dashboard/posts/write/${postId}`);
    },
    [router]
  );

  const onTableChange = useCallback(
    (data: TablePaginationConfig) => {
      const pagination: Record<string, any> = {};
      if (data.current) {
        pagination.pageNo = data.current;
      }

      if (data.pageSize) {
        pagination.pageSize = data.pageSize;
      }

      const formData = form.getFieldsValue();
      const query = _search.makeQuery({ ...formData, ...pagination });
      setState(query);
    },
    [_search, form, setState]
  );

  const onMoveToWrite = useCallback(() => {
    router.push("/dashboard/posts/write");
  }, [router]);

  useEffect(() => {
    if (!router.isReady) return;
    if (_search.IsSearchQuery(state)) {
      const formFields = _search.getClientForm(state, ["timeAll"]);
      form.setFieldsValue(formFields);
    }
  }, [router.isReady]);

  return (
    <div className="list-page">
      <div className="search-form">
        <Card title="검색" className="mt-4">
          <Form
            layout="vertical"
            form={form}
            onFinish={onFinish}
            onReset={onReset}
            initialValues={_search.getClientForm(_search.getInitialQuery(), [
              "timeAll",
            ])}
          >
            <Row>
              <Col span={colSpan}>
                <Form.Item label="검색어" name="keyword">
                  <Input placeholder="검색어" />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Space className="mt-3 flex w-full justify-center" wrap>
                <Button htmlType="reset" type="default">
                  초기화
                </Button>
                <Button
                  htmlType="submit"
                  type="primary"
                  className="!shadow-none"
                  icon={<SearchOutlined />}
                >
                  검색
                </Button>
              </Space>
            </Row>
          </Form>
        </Card>
      </div>
      <Row className="my-3 flex justify-end">
        <Space split={<Divider type="vertical" />}>
          <Button
            type="primary"
            htmlType="button"
            className="!shadow-none"
            onClick={onMoveToWrite}
          >
            등록
          </Button>
          <Button
            type="text"
            htmlType="button"
            onClick={useMemoizedFn(() => {
              query.refetch();
            })}
          >
            화면갱신
          </Button>
        </Space>
      </Row>
      <Table
        columns={[
          {
            dataIndex: "id",
            title: "순번",
            align: "center",
            width: 80,
            fixed: "left",
            render: (_, __, index: number) => {
              return computedTableIndex(data.total, pageSize, page, index);
            },
          },
          {
            dataIndex: "title",
            title: "타이틀",
            align: "center",
            width: 120,
            fixed: "left",
          },
          {
            dataIndex: "description",
            title: "설명",
            align: "left",
            width: 300,
            ellipsis: true,
          },
          {
            dataIndex: "isDraft",
            title: "초안여부",
            align: "center",
            width: 100,
            render: (value: boolean) => {
              return (
                <Tag color={value ? "green" : "red"}>
                  {value ? "초안" : "완료"}
                </Tag>
              );
            },
          },
          {
            dataIndex: "issueDate",
            title: "게시일",
            align: "center",
            width: 200,
            render: (value: string) => {
              if (!value) return "";
              return dayjs(value).format("YYYY-MM-DD HH:mm:ss");
            },
          },
          {
            dataIndex: "createdAt",
            title: "등록일",
            align: "center",
            width: 150,
            render: (value: string) => {
              return dayjs(value).format("YYYY-MM-DD");
            },
          },
          {
            dataIndex: "updatedAt",
            title: "업데이트일",
            align: "center",
            width: 150,
            render: (value: string) => {
              return dayjs(value).format("YYYY-MM-DD");
            },
          },
          {
            dataIndex: "id",
            title: "관리",
            align: "center",
            width: 100,
            render: () => {
              return (
                <Button
                  type="text"
                  size="small"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  삭제
                </Button>
              );
            },
          },
        ]}
        rowKey="id"
        dataSource={data.list}
        loading={query.isLoading}
        size="small"
        locale={{
          emptyText: "데이터가 없습니다.",
        }}
        bordered
        onChange={onTableChange}
        onRow={(record) => {
          return {
            onClick: () => onRowClick(record.id),
          };
        }}
        scroll={{ x: 1500 }}
        pagination={{
          pageSize,
          current: page,
          total: data.total,
          showSizeChanger: true,
          showQuickJumper: true,
          locale: {
            items_per_page: "개씩 보기",
          },
        }}
      />
    </div>
  );
}

Posts.getLayout = function GetLayout(page: React.ReactNode) {
  return (
    <DashboardLayout
      pageHeader={
        <div className="px-5 py-7 sm:px-10">
          <Breadcrumb
            items={[
              { title: "대시보드", href: "/dashboard" },
              { title: "게시글", href: "/dashboard/posts" },
            ]}
          />
        </div>
      }
    >
      {page}
    </DashboardLayout>
  );
};
