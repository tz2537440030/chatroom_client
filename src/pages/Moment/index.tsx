import useRequest from "@/hooks/useRequest";
import {
  cancelLikeMoment,
  createMomentComment,
  getMomentList,
  likeMoment,
} from "@/services/moment";
import { Space, Image, Popover } from "antd-mobile";
import { useEffect, useImperativeHandle, useRef, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import defaultAvatar from "@/assets/images/default-avater.svg";
import { formatChatDatetime } from "@/utils/utils";
import {
  MoreOutline,
  HeartOutline,
  MessageOutline,
  HeartFill,
} from "antd-mobile-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  selectMomentList,
  setMoment,
  setMomentList,
} from "@/store/momentSlice";
import { selectIsShowEmoji, setIsShowEmoji } from "@/store/chatSlice";
import { selectCurrentUser } from "@/store/authSlice";
import SearchOrSendInput from "@/components/SearchOrSendInput";
import { onMessage } from "@/services/websocket";
import { UPDATE_MOMENT_INFO } from "@/const";

const Moment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const momentList = useSelector(selectMomentList);
  const isShowEmoji = useSelector(selectIsShowEmoji);
  const { ref } = useOutletContext<any>();
  const momentListRef = useRef<any>(null);
  const inputRef = useRef<any>(null);
  const [commentInputVisible, setCommentInputVisible] = useState(false);
  const [currentOptMoment, setCurrentOptMoment] = useState<any>({});

  const { run } = useRequest<any, any>(getMomentList, {
    onSuccess: (res) => {
      dispatch(setMomentList({ momentList: res }));
    },
  });

  const { run: likeRun } = useRequest<any, any>(likeMoment, {
    onSuccess: (res) => {
      dispatch(setMoment({ moment: res }));
    },
  });

  const { run: cancelLikeRun } = useRequest<any, any>(cancelLikeMoment, {
    onSuccess: (res) => {
      dispatch(setMoment({ moment: res }));
    },
  });

  const { run: createCommentRun } = useRequest<any, any>(createMomentComment, {
    onSuccess: (res) => {
      dispatch(setMoment({ moment: res }));
      setCommentInputVisible(false);
      inputRef.current.clearText();
    },
  });

  useImperativeHandle(ref, () => ({
    handleRightClick: handleCameraClick,
  }));

  const handleCameraClick = () => {
    navigate("/layout-blank/post-moment");
  };

  const handleLikeMoment = (item: any, hasLiked: boolean) => {
    hasLiked
      ? cancelLikeRun({ momentId: item.id })
      : likeRun({ momentId: item.id });
  };

  const handleCommentMoment = (item: any) => {
    setCurrentOptMoment(item);
    setCommentInputVisible(true);
  };

  const handleSendComment = (text: string) => {
    createCommentRun({
      momentId: currentOptMoment.id,
      content: text,
    });
  };

  const handleTouchStart = () => {
    if (isShowEmoji) {
      dispatch(setIsShowEmoji({ isShowEmoji: false }));
    }
    if (commentInputVisible) {
      setCommentInputVisible(false);
    }
  };

  const momentOptJsx = (item: any) => {
    const hasLiked = (item: any) => {
      return item.likeUsers?.some((user: any) => user.id === currentUser.id);
    };

    return (
      <div className="flex justify-between">
        <div
          className="flex-center border-r border-gray-300 pr-2 text-gray-600"
          onClick={() => handleLikeMoment(item, hasLiked(item))}
        >
          {hasLiked(item) ? (
            <HeartFill className="mr-1" color="red" />
          ) : (
            <HeartOutline className="mr-1" />
          )}
          <span>{hasLiked(item) ? "取消" : "点赞"}</span>
        </div>
        <div
          className="flex-center pl-2 text-gray-600"
          onClick={() => handleCommentMoment(item)}
        >
          <MessageOutline className="mr-1" />
          <span>评论</span>
        </div>
      </div>
    );
  };

  useEffect(() => {
    run({ skip: 0 });
    onMessage(UPDATE_MOMENT_INFO, (data: any) => {
      dispatch(setMoment({ moment: data.data }));
    });
  }, []);

  return (
    <div>
      <div
        className="overflow-scroll bg-white py-5"
        style={{
          height: `calc(100vh - ${commentInputVisible ? "132" : "80"}px)`,
        }}
        onTouchStart={handleTouchStart}
        ref={momentListRef}
      >
        {momentList?.map((item: any) => (
          <div
            key={item.id}
            className="flex border-b-[0.5px] border-gray-300 px-2 py-3 last:border-b-0"
          >
            <img
              src={item.user?.avatar}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = defaultAvatar;
              }}
              className="mr-2 h-[44px] w-[44px] rounded-md"
            />
            <div className="flex w-full flex-col">
              <div className="font-bold text-blue-600">
                {item.user?.nickname}
              </div>
              <div className="pb-2">{item.content}</div>
              <Space wrap className="grid w-fit grid-cols-3 gap-1">
                {item.momentImages?.map((image: string) => (
                  <Image
                    key={image}
                    src={image}
                    width={80}
                    height={80}
                    fit="contain"
                  />
                ))}
              </Space>
              <div className="mt-2 flex justify-between">
                <span className="text-gray-400">
                  {formatChatDatetime(item?.createdAt)}
                </span>
                <Popover
                  content={momentOptJsx(item)}
                  trigger="click"
                  placement="right"
                  defaultVisible={false}
                >
                  <span className="flex-center rounded-sm bg-gray-200 px-2">
                    <MoreOutline />
                  </span>
                </Popover>
              </div>
              {item.likeUsers.length > 0 && (
                <div className="mt-2 rounded-md bg-gray-200 px-2 py-1 font-bold text-blue-600">
                  {item.likeUsers.map((item: any) => item.nickname).join("，") +
                    "\n"}
                  觉得很赞
                </div>
              )}
              {item.momentComments.length > 0 && (
                <div className="mt-2 rounded-md bg-gray-200 px-2 py-1">
                  {item.momentComments.map((item: any) => (
                    <div key={item.id}>
                      <span className="font-bold text-blue-600">
                        {item.user.nickname}
                      </span>
                      ：<span>{item.content}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {commentInputVisible && (
        <div
          className="py-2"
          style={{
            paddingBottom: "env(safe-area-inset-bottom)",
          }}
        >
          <SearchOrSendInput
            ref={inputRef}
            placeholder="请输入"
            btnText="发送"
            textLeft
            isShowEmojiBtn={true}
            onSearch={handleSendComment}
          />
        </div>
      )}
    </div>
  );
};
export default Moment;
