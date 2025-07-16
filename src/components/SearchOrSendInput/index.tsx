import { Button, Input } from "antd-mobile";
import { forwardRef, useImperativeHandle, useState } from "react";

interface Props {
  placeholder?: string;
  btnText?: string;
  textLeft?: boolean;
  onSearch: (text: string) => void;
}
const SearchOrSendInput = forwardRef((props: Props, ref) => {
  const { placeholder, btnText, textLeft, onSearch } = props;
  const [searchText, setSearchText] = useState("");

  const clearText = () => {
    setSearchText("");
  };

  useImperativeHandle(ref, () => ({
    clearText,
  }));

  return (
    <div className="flex px-2">
      <Input
        className={`top-search mr-5 ${textLeft ? "input-left" : ""}`}
        placeholder={placeholder}
        value={searchText}
        onChange={(v) => {
          setSearchText(v);
        }}
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
  );
});
export default SearchOrSendInput;
