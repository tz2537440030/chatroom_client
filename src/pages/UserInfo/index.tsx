import useRequest from "@/hooks/useRequest";
import { changeUserInfo, uploadFile } from "@/services/global";
import { selectCurrentUser, setCredentials } from "@/store/authSlice";
import { AddOutline } from "antd-mobile-icons";
import { Form, Input, List, Popup, type ImageUploadItem } from "antd-mobile";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const UserInfo = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const [visible, setVisible] = useState(false);
  const [fileList, setFileList] = useState<ImageUploadItem[]>([]);
  const [currentPopup, setCurrentPopup] = useState<any>(null);
  const popupNodeRef = useRef<any>(null);
  const uploadRef = useRef<any>(null);

  const { run } = useRequest<any, any>(changeUserInfo, {
    onSuccess: (res) => {
      setVisible(false);
      dispatch(setCredentials({ user: res }));
    },
  });

  const userConfigList = [
    {
      id: "username",
      label: "账号",
      value: currentUser.username,
    },
    {
      id: "nickname",
      label: "昵称",
      value: currentUser.nickname,
      onClick: () => {
        setCurrentPopup("nickname");
        setVisible(true);
        popupNodeRef.current = (
          <Form layout="horizontal" form={form}>
            <Form.Item
              label="昵称"
              name="nickname"
              rules={[
                { type: "string", min: 1, max: 8, message: "请输入1-8位昵称" },
              ]}
            >
              <Input placeholder="请输入昵称" clearable />
            </Form.Item>
          </Form>
        );
      },
      formSubmit: () => {
        if (!form.getFieldsValue().nickname) {
          setVisible(false);
          return;
        }
        run({ data: form.getFieldsValue() });
      },
    },
    {
      id: "avatar",
      label: "头像",
      value: (
        <>
          <input
            type="file"
            ref={uploadRef}
            accept="image/*"
            style={{ display: "none" }}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const formData = new FormData();
              formData.append("file", file);
              const res: any = await uploadFile(formData);
              if (res) {
                run({ data: { avatar: res } });
                setFileList([{ url: res }]);
              }
            }}
          />

          <div className="flex-center h-[44px] w-[44px] bg-gray-100">
            {!fileList[0]?.url ? (
              <AddOutline />
            ) : (
              <img
                src={fileList[0]?.url || currentUser.avatar}
                className="h-full w-full rounded object-cover"
              />
            )}
          </div>
        </>
      ),
      onClick: () => {
        setCurrentPopup("avatar");
        uploadRef.current?.click();
      },
    },
  ];

  useEffect(() => {
    setFileList([
      {
        url: currentUser.avatar,
      },
    ]);
  }, []);

  return (
    <>
      <List header="个人信息" className="mb-4">
        {userConfigList.map((item) => (
          <List.Item
            key={item.label}
            prefix={item.label}
            onClick={item.onClick}
          >
            <div className="flex justify-end">{item.value}</div>
          </List.Item>
        ))}
      </List>
      <Popup
        visible={visible}
        onMaskClick={() => {
          const currentPopupObj: any = userConfigList.find(
            (item) => item.id === currentPopup,
          );
          if (currentPopupObj) {
            currentPopupObj.formSubmit();
          }
        }}
        bodyStyle={{ height: "40vh" }}
      >
        {popupNodeRef.current}
      </Popup>
    </>
  );
};
export default UserInfo;
