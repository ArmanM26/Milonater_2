// Register.js
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { notification, Form, Input, Button } from "antd"; // Import necessary components from antd
import { auth, db } from "../firebase"; // Firebase auth and Firestore
import { setDoc, doc } from "firebase/firestore"; // Firestore database
import { Link, useNavigate } from "react-router-dom"; // Navigation
import "./styles.css"; // Your CSS file

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // Handle form submission
  const handleRegister = async (values) => {
    setLoading(true);
    const { name, email, password } = values;

    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const { uid } = response.user;

      // Store user data in Firestore
      const userDoc = doc(db, "users", uid);
      await setDoc(userDoc, {
        uid,
        name,
        email,
      });

      // Reset form and notify user
      form.resetFields();
      notification.success({ message: "Registration successful!" });
      navigate("/home");
    } catch (error) {
      notification.error({
        message: "Registration Failed",
        description: error.message || "An error occurred during registration.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2> {/* Heading for the form */}
      <Form
        layout="vertical"
        form={form}
        onFinish={handleRegister}
        className="form-group"
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input your name" }]}
        >
          <Input placeholder="Name" />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your email" }]}
        >
          <Input type="email" placeholder="Email" />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: "Please input your password" },
            {
              pattern: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/,
              message:
                "Password must be 6-16 characters and include a number and a special character.",
            },
          ]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Register
        </Button>
        <Link to="/login" className="link">
          Already have an account? Sign in
        </Link>
      </Form>
    </div>
  );
};

export default Register; // Exporting the Register component
