// 全局共享数据
import { useState } from 'react';
import { IUseSchedule } from 'typings';

const useSchedule = () => {
  const [scheduleList, setScheduleList] = useState<Array<IUseSchedule>>([]);
  return {
    scheduleList,
    setScheduleList,
  };
};

export default useSchedule;
