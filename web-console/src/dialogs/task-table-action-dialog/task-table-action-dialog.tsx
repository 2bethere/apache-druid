/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useState } from 'react';

import { ShowJson, ShowLog } from '../../components';
import { Api } from '../../singletons';
import { deepGet } from '../../utils';
import type { BasicAction } from '../../utils/basic-action';
import type { SideButtonMetaData } from '../table-action-dialog/table-action-dialog';
import { TableActionDialog } from '../table-action-dialog/table-action-dialog';

type TaskTableActionDialogTab = 'status' | 'report' | 'spec' | 'log';

interface TaskTableActionDialogProps {
  taskId: string;
  actions: BasicAction[];
  status: string;
  onClose(): void;
}

export const TaskTableActionDialog = React.memo(function TaskTableActionDialog(
  props: TaskTableActionDialogProps,
) {
  const { taskId, actions, onClose, status } = props;
  const [activeTab, setActiveTab] = useState<TaskTableActionDialogTab>('status');

  const taskTableSideButtonMetadata: SideButtonMetaData[] = [
    {
      icon: 'dashboard',
      text: 'Status',
      active: activeTab === 'status',
      onClick: () => setActiveTab('status'),
    },
    {
      icon: 'comparison',
      text: 'Reports',
      active: activeTab === 'report',
      onClick: () => setActiveTab('report'),
    },
    {
      icon: 'align-left',
      text: 'Spec',
      active: activeTab === 'spec',
      onClick: () => setActiveTab('spec'),
    },
    {
      icon: 'align-justify',
      text: 'Log',
      active: activeTab === 'log',
      onClick: () => setActiveTab('log'),
    },
  ];

  const taskEndpointBase = `/druid/indexer/v1/task/${Api.encodePath(taskId)}`;
  return (
    <TableActionDialog
      sideButtonMetadata={taskTableSideButtonMetadata}
      onClose={onClose}
      title={`Task: ${taskId}`}
      actions={actions}
    >
      {activeTab === 'status' && (
        <ShowJson
          endpoint={`${taskEndpointBase}/status`}
          transform={x => deepGet(x, 'status') || x}
          downloadFilename={`task-status-${taskId}.json`}
        />
      )}
      {activeTab === 'report' && (
        <ShowJson
          endpoint={`${taskEndpointBase}/reports`}
          transform={x => deepGet(x, 'ingestionStatsAndErrors.payload') || x}
          downloadFilename={`task-reports-${taskId}.json`}
        />
      )}
      {activeTab === 'spec' && (
        <ShowJson
          endpoint={taskEndpointBase}
          transform={x => deepGet(x, 'payload') || x}
          downloadFilename={`task-payload-${taskId}.json`}
        />
      )}
      {activeTab === 'log' && (
        <ShowLog
          tail={status === 'RUNNING'}
          endpoint={`${taskEndpointBase}/log`}
          downloadFilename={`task-log-${taskId}.log`}
          tailOffset={16000}
        />
      )}
    </TableActionDialog>
  );
});
