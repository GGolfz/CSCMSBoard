import React, { Fragment, useState } from "react";

const Paper = ({ data, posX, posY, canModify, onEdit, handleChange }) => {
  return (
    <Fragment>
      <div className="paper" style={{ top: posY, left: posX }}>
        {canModify ? (
          <Fragment>
            <div className="paper-field">
              <div className="row">
                <div className="label">Title</div>
                <div className="paper-input">
                  <input
                    type="text"
                    value={data.title}
                    name="title"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="row">
                <div className="label">Description</div>
                <div className="paper-input">
                  <input
                    type="text"
                    value={data.description}
                    name="description"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="row">
                <div className="label">Sender</div>
                <div className="paper-input">
                  <input
                    type="text"
                    value={data.sender}
                    name="sender"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <div className="post-btn" onClick={onEdit}>Post</div>
          </Fragment>
        ) : (
          <Fragment>
            <div className="title">
              <div>{data.title}</div>
            </div>
            <div className="description">{data.description}</div>
            <div className="sender">{data.sender}</div>
          </Fragment>
        )}
      </div>
      <style jsx>
        {`
          .paper {
            position: absolute;
            background: white;
            padding: 1rem;
            display: flex;
            flex-flow: column;
            border-radius: 10px;
          }
          .row {
            display: flex;
          }
          .label {
            width: 40%;
          }
          .paper-input {
            width: 60%;
          }
          .post-btn {
            background: #f2facc;
          }
        `}
      </style>
    </Fragment>
  );
};
export default Paper;
