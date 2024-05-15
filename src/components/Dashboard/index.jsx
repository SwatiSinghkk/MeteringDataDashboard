import React from 'react';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import FormData from '../FormData';
 import GraphData from '../GraphData/LineChart';

const { Header, Content, Footer } = Layout;
const items = new Array(1).fill(null).map((_, index) => ({
  label: `Home`,
}));
const Dashboard = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout>
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          items={items}
          style={{
            flex: 1,
            minWidth: 0,
          }}
        />
      </Header>
      <Content
        style={{
          padding: '0 48px',
        }}
      >
        <Breadcrumb
          style={{
            margin: '16px 0',
          }}
        >
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>Form</Breadcrumb.Item>
        </Breadcrumb>
        <div
          style={{
            padding: 24,
            minHeight: 380,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <FormData/>
        </div>
      </Content>
      <Footer
        style={{
          textAlign: 'center',
        }}
      >
       Metering Data Dashboard
      </Footer>
    </Layout>
  );
};
export default Dashboard;