import { waitTime } from '@/utils/tools';
import {
  ProForm,
  ProFormInstance,
  ProFormText,
} from '@ant-design/pro-components';
import { useModel, useRequest } from '@umijs/max';
import { Modal, message } from 'antd';
import { useEffect, useRef } from 'react';

interface ScheduleFormProps {
  open: boolean;
  onClose(): void;
  currentId?: number;
}

interface FormValueProps {
  title: string;
  description?: string;
}

const ScheduleFormComponent: React.FC<ScheduleFormProps> = (props) => {
  const { open, onClose, currentId } = props;
  const { scheduleList, setScheduleList } = useModel('global'); // 简易数据流 - 日程列表
  const formRef = useRef<ProFormInstance>(); // 控制表单项
  const [messageApi, contextHolder] = message.useMessage();

  // 编辑时自动设置表单
  useEffect(() => {
    if (!currentId) return;
    const index = scheduleList.findIndex((item) => item.id === currentId);
    formRef.current?.setFieldsValue(scheduleList[index]);
  }, [currentId]);

  const handleAfterClose = () => {
    onClose();
    formRef.current?.resetFields?.();
  };

  // 提交表单 - 模拟接口
  const { run: setScheduleListRun, loading: submitLoading } = useRequest(
    async () => {
      return await waitTime(100);
    },
    {
      manual: true,
      onSuccess: () => {
        handleAfterClose();
        messageApi.open({
          type: 'success',
          content: '提交成功',
        });
      },
    },
  );

  // 提交表单
  const handleFinish = () => {
    formRef?.current
      ?.validateFields?.()
      .then(async (values: FormValueProps) => {
        setScheduleList([
          ...scheduleList,
          {
            id: new Date().valueOf(),
            status: false,
            ...values,
          },
        ]);
        setScheduleListRun();
      });
  };

  return (
    <Modal
      title={`${currentId ? '编辑' : '添加'}新日程`}
      open={open}
      cancelText="取消"
      okText="提交"
      onCancel={handleAfterClose}
      onOk={() => {
        handleFinish();
      }}
      centered
      confirmLoading={submitLoading}
    >
      <ProForm<{
        title: string;
        description?: string;
      }>
        formRef={formRef}
        params={{}}
        submitter={false}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: '请输入名称',
            },
          ]}
          width="md"
          name="title"
          label="名称"
          placeholder="请输入名称"
        />
        <ProFormText
          width="md"
          name="description"
          label="描述"
          placeholder="请输入描述"
        />
      </ProForm>
      {contextHolder}
    </Modal>
  );
};

export default ScheduleFormComponent;
