import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import FilterOptions from '../FilterOptions/FilterOptions';
import { FILTER_IDENTITIES } from '../../constants/ColumnFilter';
import { getErrorMessage } from '../../utils/helpers';
import { Table, message } from 'antd';

import './IdentitiesManagement.scss';

const propTypes = {
  getIdentities: PropTypes.func.isRequired,
  history: PropTypes.object
};

const defaultProps = {};

const IdentitiesManagement = ({ getIdentities, history }) => {
  const [dataTable, setDataTable] = useState([]);
  const [paramsTable, setParamsTable] = useState({});
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDataTable();
  }, []);

  const tableColumns = [
    {
      title: 'Identity ID',
      dataIndex: 'id',
      sorter: false,
      render: (text, record) => (
        <span className="table__id" onClick={handleViewIdentityDetails(record)}>
          {text}
        </span>
      )
    },
    {
      title: 'Customer ID',
      dataIndex: 'customerId',
      sorter: true
    },
    {
      title: 'Identification ID No',
      dataIndex: 'identityNumber',
      sorter: true
    },
    {
      title: 'Issued on',
      dataIndex: 'registrationDate',
      sorter: true
    },
    {
      title: 'Staff ID Approved',
      dataIndex: 'staffIdApproved',
      sorter: false
    }
  ];

  const handleViewIdentityDetails = identity => () => {
    history.push('./identities/' + identity.id);
  };

  const onTableChange = (pagination, filters, sorter) => {
    const sortOrder =
      sorter.order === 'descend'
        ? 'desc'
        : sorter.order === 'ascend'
        ? 'asc'
        : undefined;

    fetchDataTable({
      ...paramsTable,
      page: pagination.current,
      pageSize: pagination.pageSize,
      sortBy: sorter.field,
      sortType: sortOrder
    });
  };

  const fetchDataTable = async (params = {}) => {
    const { page, pageSize } = pagination;
    const customParams = {
      page: params.page || page,
      limit: params.pageSize || pageSize,
      sortBy: params.sortBy,
      sortType: params.sortType,

      identityNumber: params.identityNumber,
      customerId: params.customerId,
      approved: params.approved,
      registrationDate: params.registrationDate
    };

    try {
      setLoading(true);

      const { items, totalItems } = await getIdentities(customParams);

      const paper = { ...pagination };
      paper.total = totalItems;
      paper.current = customParams.page;

      setLoading(false);
      setPagination(paper);
      setParamsTable(customParams);
      setDataTable(items);
    } catch (err) {
      message.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      <h2 className="page-header">IDENTITIES INFORMATION</h2>
      <FilterOptions
        columnFilter={FILTER_IDENTITIES}
        fetchData={fetchDataTable}
        paramsTable={paramsTable}
      />
      <div className="table">
        <Table
          size="middle"
          rowKey={record => record.id}
          dataSource={dataTable}
          pagination={pagination}
          columns={tableColumns}
          loading={loading}
          onChange={onTableChange}
        />
      </div>
    </div>
  );
};

IdentitiesManagement.propTypes = propTypes;
IdentitiesManagement.defaultProps = defaultProps;

export default IdentitiesManagement;