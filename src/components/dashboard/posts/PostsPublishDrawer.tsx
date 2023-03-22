import React, { useCallback, useEffect, useRef, useState } from 'react'

// components
import { Drawer, Button, Row, Form, Col, Input, Select, DatePicker } from 'antd';
import { isString } from 'antd/lib/button';

// hooks
import { useEditorContext } from '~/context/editor-context';
import { useFormContext } from 'react-hook-form';
import { useRouter } from 'next/router';

// api
import { api } from '~/utils/api';

// types
import type { CreateData } from '~/libs/validation/posts';
import type { SubmitHandler } from 'react-hook-form';
import type { FormInstance } from "antd";

const { Option } = Select

interface InternalPostsPublishDrawerProps {
  setForm: (form: FormInstance | null) => void;
  setLoading: (loading: boolean) => void;
}

const InternalPostsPublishDrawer: React.FC<InternalPostsPublishDrawerProps> = ({
  setForm,
  setLoading,
}) => {
  const router = useRouter();

  const $form = useRef<FormInstance>(null);

  const { handleSubmit } = useFormContext<CreateData>();

  const mutation_create = api.posts.create.useMutation();

  const mutation_update = api.posts.update.useMutation();

  const onSubmit: SubmitHandler<CreateData> = (input) => {
    const id = router.query.id?.toString();
    console.log(input)
    if (!id) {
      return;
    }
  }

  useEffect(() => {
    setForm($form.current);
  }, []);

  useEffect(() => {
    if (mutation_create.isLoading || mutation_update.isLoading) {
      setLoading(true);
    } else {
      setLoading(false)
    }
  }, [mutation_create.isLoading, mutation_update.isLoading])

  return (
    <Form layout="vertical" ref={$form} onFinish={handleSubmit(onSubmit)}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="name"
            label="Name"
          >
            <Input placeholder="Please enter user name" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="url"
            label="Url"
          >
            <Input
              style={{ width: '100%' }}
              addonBefore="http://"
              addonAfter=".com"
              placeholder="Please enter url"
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="owner"
            label="Owner"
          >
            <Select placeholder="Please select an owner">
              <Option value="xiao">Xiaoxiao Fu</Option>
              <Option value="mao">Maomao Zhou</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="type"
            label="Type"
          >
            <Select placeholder="Please choose the type">
              <Option value="private">Private</Option>
              <Option value="public">Public</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="approver"
            label="Approver"
          >
            <Select placeholder="Please choose the approver">
              <Option value="jack">Jack Ma</Option>
              <Option value="tom">Tom Liu</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="dateTime"
            label="DateTime"
          >
            <DatePicker.RangePicker
              style={{ width: '100%' }}
              getPopupContainer={(trigger) => trigger.parentElement!}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea rows={4} placeholder="please enter url description" />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
}

const PostsPublishDrawer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [$form, setFormElement] = useState<FormInstance | null>(null);
  const { publish, popoverClose } = useEditorContext();

  const onClose = useCallback(() => {
    popoverClose({ id: 'publish' })
  }, [popoverClose])

  const setForm = useCallback((form: FormInstance | null) => {
    setFormElement(form);
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading)
  }, [])

  const onSubmit = useCallback(() => {
    $form?.submit();
  }, [$form]);

  useEffect(() => {
    if (!publish.open) {
      setForm(null);
      setIsLoading(false);
    }
  }, [publish.open])

  return (
    <Drawer
      title="Publish"
      width={368}
      onClose={onClose}
      destroyOnClose
      open={publish.open}
      bodyStyle={{ paddingBottom: 80 }}
      extra={
        <Button loading={isLoading} onClick={onSubmit} type="primary" className="!shadow-none">
          Publish
        </Button>
      }
    >
      <InternalPostsPublishDrawer setForm={setForm} setLoading={setLoading} />
    </Drawer>
  )
}

export default PostsPublishDrawer
