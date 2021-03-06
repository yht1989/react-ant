import React, { Component } from 'react';
import {
  Form,
  Modal,
  Table,
  Divider,
  Tag,
  Input,
  Button,
  DatePicker,
  Popconfirm,
  message
} from 'antd';
const { RangePicker } = DatePicker;
import { addManInfo, delManInfo, editManInfo } from '@reduxs/reducers/manage';
import { Manage } from '@reduxs/actions/actionType';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import './manage.less';

interface propsType {
  manage: Array<Manage>;
  form: any;
  addManInfo: (v: Manage) => Array<Manage>;
  delManInfo: (v: Manage) => Array<Manage>;
  editManInfo: (v: Manage) => Array<Manage>;
}
interface stateType {
  visible: boolean;
  isEdit: boolean;
}

class ManageInfo extends Component<propsType, stateType> {
  constructor(props: propsType) {
    super(props);
    this.state = {
      visible: false,
      isEdit: false
    };
  }

  open() {
    this.data = {
      key: '',
      name: '',
      age: '',
      address: '',
      tags: ''
    };
    this.props.form.resetFields();
    this.setState({ visible: true });
  }

  edit(text: any) {
    Object.assign(this.data, text);
    this.setState({ visible: true, isEdit: true });
  }

  handleOk(e: any) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err: any, values: any) => {
      if (!err) {
        if (this.state.isEdit) {
          this.props.editManInfo({
            key: this.data.key,
            name: values.name || '',
            age: values.age || '',
            time: moment().format('YYYY-MM-DD HH:mm:ss'),
            address: values.address || '',
            tags: values.tags || ''
          });
          message.success('编辑成功');
        } else {
          this.props.addManInfo({
            key: `${Date.now()}`,
            name: values.name || '',
            age: values.age || '',
            time: moment().format('YYYY-MM-DD HH:mm:ss'),
            address: values.address || '',
            tags: values.tags || ''
          });
          message.success('新增成功');
        }
        this.setState({
          visible: false
        });
      }
    });
  }

  private data = {
    key: '',
    name: '',
    age: '',
    address: '',
    tags: ''
  };

  render() {
    const { delManInfo } = this.props;
    const confirm = function name(p: any): void {
      delManInfo(p);
      message.success('删除成功');
    };
    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '年龄',
        dataIndex: 'age',
        key: 'age'
      },
      {
        title: '地址',
        dataIndex: 'address',
        key: 'address'
      },
      {
        title: '创建时间',
        dataIndex: 'time',
        key: 'time'
      },
      {
        title: '标签',
        key: 'tags',
        dataIndex: 'tags',
        render: (tags: string) => (
          <span>
            {(tags || '').split(/[,，]+/).map(tag => {
              let color = tag.length > 5 ? 'geekblue' : 'green';
              if (tag === 'loser') {
                color = 'volcano';
              }
              return (
                <Tag color={color} key={tag}>
                  {tag.toUpperCase()}
                </Tag>
              );
            })}
          </span>
        )
      },
      {
        title: '操作',
        key: 'action',
        render: (text: any) => (
          <span>
            <a onClick={() => edit(text)}>编辑</a>
            <Popconfirm
              placement='top'
              title='是否删除'
              onConfirm={() => confirm(text)}
              okText='确认'
              cancelText='取消'
            >
              <Divider type='vertical' />
              <a>删除</a>
            </Popconfirm>
          </span>
        )
      }
    ];
    const { getFieldDecorator } = this.props.form;
    const handleOk = this.handleOk.bind(this);
    const open = this.open.bind(this);
    const edit = this.edit.bind(this);

    return (
      <div className='login_man'>
        <header className='man_head'>
          <span>姓名:</span>
          <Input placeholder='请输入姓名' style={{ margin: '0 20px' }} />
          <RangePicker placeholder={['开始时间', '结束时间']} />
          <Button style={{ float: 'right' }} type='primary'>
            查询
          </Button>
        </header>
        <main>
          <Button onClick={open} style={{ margin: '20px 0' }} type='primary'>
            新建
          </Button>
          <Table columns={columns} dataSource={this.props.manage} />
          <Modal
            title={this.state.isEdit ? '编辑' : '新增'}
            okText='确定'
            cancelText='取消'
            visible={this.state.visible}
            onOk={handleOk}
            onCancel={() => this.setState({ visible: false, isEdit: false })}
          >
            <Form
              style={{ margin: '20px auto' }}
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 15 }}
            >
              <Form.Item label='姓名'>
                {getFieldDecorator('name', {
                  initialValue: this.data.name,
                  rules: [
                    {
                      required: true,
                      message: '请输入姓名'
                    }
                  ]
                })(<Input allowClear placeholder='请输入姓名' />)}
              </Form.Item>
              <Form.Item label='年龄'>
                {getFieldDecorator('age', {
                  initialValue: this.data.age,
                  rules: [
                    {
                      required: true,
                      message: '请输入年龄'
                    }
                  ]
                })(<Input allowClear placeholder='请输入年龄' />)}
              </Form.Item>
              <Form.Item label='地址'>
                {getFieldDecorator('address', {
                  initialValue: this.data.address,
                  rules: [
                    {
                      required: true,
                      message: '请输入地址'
                    }
                  ]
                })(<Input allowClear placeholder='请输入地址' />)}
              </Form.Item>
              <Form.Item label='标签'>
                {getFieldDecorator('tags', {
                  initialValue: this.data.tags
                })(<Input.TextArea placeholder='多个标签使用标点分隔' />)}
              </Form.Item>
            </Form>
          </Modal>
        </main>
      </div>
    );
  }
}

export default connect(
  (state: any) => {
    return {
      manage: state.manage
    };
  },
  dispatch =>
    bindActionCreators(
      {
        addManInfo,
        delManInfo,
        editManInfo
      },
      dispatch
    )
)(Form.create({ name: 'manage' })(ManageInfo));
