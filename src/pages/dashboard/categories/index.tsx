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
} from "antd";
import React, { useCallback, useEffect, useMemo } from "react";
import DashboardLayout from "~/components/dashboard/DashboardLayout";
import { SearchOutlined } from "@ant-design/icons";
import { useMedia } from "~/libs/hooks/useMedia";
import { useResetUrlState, useUrlState } from "~/libs/hooks/useUrlState";
import { useRouter } from "next/router";
import { CategoriesSearch } from "~/libs/search/categories";

interface FormFields {
  keyword: string;
}

const defaultQuery = {
  pageNo: "1",
  pageSize: "10",
  keyword: "",
};

export default function Categories() {
  const router = useRouter();

  const [state, setState] = useUrlState(defaultQuery);

  const reset = useResetUrlState();

  const isMobile = useMedia("(max-width: 768px)", false);
  const colSpan = useMemo(() => (isMobile ? 24 : 12), [isMobile]);

  const _search = useMemo(() => {
    const _instance = new CategoriesSearch<FormFields>({
      initialQuery: defaultQuery,
    });
    return _instance;
  }, []);

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
          <Button type="primary" htmlType="button" className="!shadow-none">
            등록
          </Button>
          <Button type="text" htmlType="button">
            화면갱신
          </Button>
        </Space>
      </Row>
      <Table
        columns={[
          {
            dataIndex: "seq",
            title: "순번",
            sorter: false,
            align: "center",
          },
          {
            dataIndex: "name",
            title: "카테고리명",
            align: "center",
          },
          {
            dataIndex: "description",
            title: "설명",
            align: "center",
          },
          {
            dataIndex: "createdAt",
            title: "등록일",
            align: "center",
          },
          {
            dataIndex: "updatedAt",
            title: "업데이트일",
            align: "center",
          },
        ]}
        rowKey="seq"
        dataSource={[]}
        size="small"
        locale={{
          emptyText: "데이터가 없습니다.",
        }}
        bordered
      />
    </div>
  );
}

Categories.getLayout = function GetLayout(page: React.ReactNode) {
  return (
    <DashboardLayout
      pageHeader={
        <div className="py-7 px-5 sm:px-10">
          <Breadcrumb>
            <Breadcrumb.Item>대시보드</Breadcrumb.Item>
            <Breadcrumb.Item>카테고리</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      }
    >
      {page}
    </DashboardLayout>
  );
};
