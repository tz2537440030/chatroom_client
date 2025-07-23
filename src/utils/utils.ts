import pinyin from "pinyin";
import { groupBy, sortBy } from "lodash";
import dayjs from "dayjs";
import { SHA256 } from "crypto-js";
export const hashPassword = async (password: string) => {
  if (window.crypto?.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedPassword = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return hashedPassword;
  } else {
    return SHA256(password).toString();
  }
};

export const isCurrentUser = (id: number) => {
  return String(id) === localStorage.getItem("userid");
};

export const groupFriendList = (friendList: any) => {
  const getInitial = (name: string) => {
    const isChinese = (char: string) => {
      const charCode = char.charCodeAt(0);
      // 基本汉字范围：4E00-9FA5
      return charCode >= 0x4e00 && charCode <= 0x9fa5;
    };

    if (isChinese(name)) {
      return pinyin(name.charAt(0), {
        style: pinyin.STYLE_FIRST_LETTER,
      })[0][0].toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  const sortedFriends = sortBy(friendList, (friend) =>
    getInitial(friend.nickname),
  );
  const groupedFriends = groupBy(sortedFriends, (friend) =>
    getInitial(friend.nickname),
  );
  return groupedFriends;
};

export const formatChatDatetime = (dateTime: string) => {
  const now = dayjs();
  const target = dayjs(dateTime);
  // 检查是否是当年
  if (target.year() !== now.year()) {
    return target.format("YYYY-MM-DD HH:mm"); // 非当年：YYYY-MM-DD HH:mm
  }
  // 检查是否是当天
  if (target.isSame(now, "day")) {
    return target.format("HH:mm"); // 当天：HH:mm
  }
  // 默认返回 MM-DD HH:mm（当年但非当天）
  return target.format("MM-DD HH:mm");
};
