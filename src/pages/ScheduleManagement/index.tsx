import { waitTime } from '@/utils/tools';
import { PageContainer } from '@ant-design/pro-components';
import { useModel, useRequest } from '@umijs/max';
import { Button, Space, Switch, Table, TableProps, message } from 'antd';
import { useRef, useState } from 'react';
import { IUseSchedule } from 'typings';
import ScheduleFormComponent from './ScheduleFormComponent';
import styles from './index.less';
/**
 * 使用 React 技术栈开发一个简化版的日程管理应用组件。
 * 该组件应允许用户创建和显示他们的任务。
 * 设计仍应保持简洁、直观。
 * 确保核心功能：
 * • 用户能够创建任务，并为每个任务设置简短的描述。
 * • 实现一个任务列表视图，展示所有创建的任务。
 * • 可选功能：允许用户标记任务为完成/未完成。
 *
 * 技术要求：
 * • 组件需要在多种平台（如iOS、Android、Web）上运行。
 * • 实现响应式设计，以适应不同大小的屏幕和设备。
 * • 去除较为复杂的附加功能，如云数据库集成、用户登录功能等。
 */

const ScheduleManagementPage: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false); // 控制弹窗显隐
  const { scheduleList, setScheduleList } = useModel('global'); // 简易数据流 - 日程列表
  const [messageApi, contextHolder] = message.useMessage();
  const updateId = useRef(0);
  const [currentId, setCurrentId] = useState<number>(); // 控制当前项 id

  // 添加日程
  const handleAddBtnClick = () => {
    setCurrentId(0);
    setOpen(true);
  };

  // 清空日程 - 模拟接口
  const { run: clearScheduleRun, loading: clearLoading } = useRequest(
    async () => {
      await waitTime(100);
      setScheduleList([]);
      return;
    },
    {
      manual: true,
      onSuccess: () => {
        messageApi.open({
          type: 'success',
          content: '清空成功',
        });
      },
    },
  );

  // 删除日程
  const handleDelete = (id: number) => {
    setScheduleList(scheduleList.filter((item) => item.id !== id));
  };

  // 删除日程 - 模拟接口
  const { run: deleteScheduleRun, loading: deleteLoading } = useRequest(
    async (id) => {
      await waitTime(100);
      handleDelete(id);
      return;
    },
    {
      manual: true,
      onSuccess: () => {
        messageApi.open({
          type: 'success',
          content: '删除成功',
        });
      },
    },
  );

  // 更新日程状态
  const handleChangeStatus = (id: number, status: boolean) => {
    setScheduleList((prevState) => {
      const newScheduleList = [...prevState];
      const index = prevState.findIndex((item) => item.id === id);
      if (index !== -1) {
        newScheduleList[index].status = status;
      }
      return newScheduleList;
    });
  };

  // 更新日程状态 - 模拟接口
  const { run: updateScheduleRun, loading: updateLoading } = useRequest(
    async ({ id, checked }) => {
      await waitTime(100);
      handleChangeStatus(id, checked);
      return;
    },
    {
      manual: true,
      onSuccess: () => {},
    },
  );

  const columns: TableProps<IUseSchedule>['columns'] = [
    {
      title: '名称',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => {
        return (
          <a
            onClick={() => {
              setCurrentId(record.id);
              setOpen(true);
            }}
          >
            {text}
          </a>
        );
      },
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      render: (text) => text || '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (_, record) => (
        <Switch
          value={record.status}
          onChange={(checked: boolean) => {
            updateId.current = record.id;
            updateScheduleRun({
              id: record.id,
              checked: checked,
            });
          }}
          loading={updateId.current === record.id && updateLoading}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: '25%',
      render: (_, record) => (
        <Space size="middle">
          <Button
            loading={updateId.current === record.id && deleteLoading}
            onClick={() => {
              updateId.current = record.id;
              deleteScheduleRun(record.id);
            }}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer ghost>
      <div className={styles.scheduleWrap}>
        <div className={styles.btnWrap}>
          <Button
            type="primary"
            className={styles.addBtn}
            onClick={handleAddBtnClick}
          >
            添加新日程
          </Button>
          <Button
            className={styles.clearBtn}
            onClick={clearScheduleRun}
            loading={clearLoading}
          >
            清空日程
          </Button>
        </div>

        <ScheduleFormComponent
          open={open}
          currentId={currentId}
          onClose={() => setOpen(false)}
        />

        <Table
          rowKey="id"
          columns={columns}
          dataSource={scheduleList}
          pagination={{
            hideOnSinglePage: true,
            size: 'default',
            defaultPageSize: 7, // 7条数据以内不分页
            showTotal: () => false,
          }}
        />
      </div>
      {contextHolder}
    </PageContainer>
  );
};

export default ScheduleManagementPage;
