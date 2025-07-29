import { Button, Input } from "antd-mobile";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { SmileOutline } from "antd-mobile-icons";
import { EmojiKeyboard } from "reactjs-emoji-keyboard";
import { useDispatch, useSelector } from "react-redux";
import { selectIsShowEmoji, setIsShowEmoji } from "@/store/chatSlice";

interface Props {
  placeholder?: string;
  btnText?: string;
  textLeft?: boolean;
  onSearch: (text: string) => void;
}
const SearchOrSendInput = forwardRef((props: Props, ref) => {
  const { placeholder, btnText, textLeft, onSearch } = props;
  const dispatch = useDispatch();
  const isShowEmoji = useSelector(selectIsShowEmoji);
  const [searchText, setSearchText] = useState("");
  const inputRef = useRef<any>(null);

  const clearText = () => {
    setSearchText("");
  };

  const focus = () => {
    inputRef.current.focus();
  };

  const handleChooseEmoji = () => {
    dispatch(setIsShowEmoji({ isShowEmoji: !isShowEmoji }));
  };

  const handleClickEmoji = (emoji: any) => {
    const inputFocusIndex = inputRef.current.nativeElement.selectionStart;
    const textBefore = searchText.slice(0, inputFocusIndex);
    const textAfter = searchText.slice(inputFocusIndex);
    setSearchText(textBefore + emoji.character + textAfter);
  };

  useEffect(() => {
    return () => {
      dispatch(setIsShowEmoji({ isShowEmoji: false }));
    };
  }, []);

  useImperativeHandle(ref, () => ({
    clearText,
    focus,
  }));

  return (
    <div>
      <div className={`flex px-2 ${isShowEmoji && "pb-2"}`}>
        <Input
          className={`top-search mr-5 ${textLeft ? "input-left" : ""}`}
          placeholder={placeholder}
          value={searchText}
          onChange={(v) => {
            setSearchText(v);
          }}
          ref={inputRef}
        />
        <SmileOutline
          fontSize={40}
          className="mr-3"
          onClick={handleChooseEmoji}
        />
        <Button
          color="primary"
          size="middle"
          disabled={!searchText}
          className="whitespace-nowrap rounded-xl"
          onClick={() => onSearch(searchText)}
        >
          {btnText || "搜索"}
        </Button>
      </div>
      {isShowEmoji && (
        <EmojiKeyboard
          height={320}
          containerStyle={{ width: "100%" }}
          theme="light"
          searchLabel="Procurar emoji"
          searchDisabled={false}
          onEmojiSelect={handleClickEmoji}
          categoryDisabled={false}
        />
      )}
    </div>
  );
});
export default SearchOrSendInput;
