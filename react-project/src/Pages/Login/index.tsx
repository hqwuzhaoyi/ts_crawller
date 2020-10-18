import React, { FC, useState } from "react";
import { Form, Input, Button, message } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { FormProps } from "antd/lib/form/Form";
import { Redirect } from "react-router-dom";
// import axios from "axios";
import request from "../../request";
import qs from "qs";

import { ValidateErrorEntity } from "rc-field-form/lib/interface";

import "./login.css";

interface FormFields {
  password: string;
}
interface Props {
  form: FormProps<FormFields>;
}

const NormalLoginForm: FC = () => {
  //   const [form] = Form.useForm();

  const [isLogin, setIsLogin] = useState(false);

  const onFinish = (values: FormFields) => {
    console.log("Received values of form: ", values.password);
    request
      .post(
        "/api/login",
        qs.stringify({
          password: values.password,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then(({ data }: { data: responseResult.login }) => {
        if (data) {
          setIsLogin(true);
        } else {
          // message.error(data?.errMsg);
        }
      })
      .catch((err) => {
        message.error("登陆失败");
        console.warn("登陆失败", err);
      });
  };

  const onFinishFailed = ({
    values,
    errorFields,
    outOfDate,
  }: ValidateErrorEntity<FormFields>) => {
    console.log("Received values of form: ", values);
    console.log("Received values of form: ", errorFields);
    console.log("Received values of form: ", outOfDate);
  };

  return isLogin ? (
    <Redirect to={"/"} />
  ) : (
    <div className="login-page">
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "请输入登录密码！",
            },
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default NormalLoginForm;
