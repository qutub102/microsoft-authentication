import React from "react";

type Props = {
  graphData: any;
};

function Chat({ graphData }: Props) {
  return (
    <div>
      <h1>Name: {graphData?.displayName}</h1>
    </div>
  );
}

export default Chat;
