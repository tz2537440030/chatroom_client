import {
  Form,
  ImageUploader,
  TextArea,
  Toast,
  type ImageUploadItem,
} from "antd-mobile";
import { useImperativeHandle, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import styles from "./post.module.css";
import { uploadFile } from "@/services/global";
import useRequest from "@/hooks/useRequest";
import { createMoment } from "@/services/moment";

const Post = () => {
  const { ref } = useOutletContext<any>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<ImageUploadItem[]>([]);

  useImperativeHandle(ref, () => ({
    handleRightClick: handlePost,
  }));

  const { run } = useRequest<any, any>(createMoment, {
    onSuccess: () => {
      navigate("/layout-blank/moment");
    },
  });

  const handlePost = () => {
    const { content, imageUrls = [] } = form.getFieldsValue();
    if (!content) {
      Toast.show({
        content: "说点什么吧",
      });
      return;
    }
    run({
      content,
      imageUrls: imageUrls.map((item: any) => item.url),
    });
  };

  const handleUpload = async (file: File) => {
    try {
      if (!file) return { url: "" };
      const formData = new FormData();
      formData.append("file", file);
      const res: any = await uploadFile(formData);
      if (res) {
        return {
          url: res,
        };
      } else {
        return {
          url: "",
        };
      }
    } catch (error) {
      alert(error);
      return {
        url: "",
      };
    }
  };

  return (
    <div className={styles["post-form"]}>
      <Form form={form}>
        <Form.Item name="content">
          <TextArea
            placeholder="说点什么吧......"
            maxLength={100}
            rows={2}
            showCount
          />
        </Form.Item>
        <Form.Item name="imageUrls">
          <ImageUploader
            accept="image/*"
            value={fileList}
            onChange={setFileList}
            maxCount={9}
            upload={handleUpload}
          />
        </Form.Item>
      </Form>
    </div>
  );
};

export default Post;
