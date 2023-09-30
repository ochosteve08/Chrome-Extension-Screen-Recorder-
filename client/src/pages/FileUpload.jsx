import { useState } from "react";

const FileUpload = () => {
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);

  const HandleOnChange = (event) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
    if (!event.target.files) {
      setName(event.target.value);
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      // Handle File Data from the state Before Sending
      const data = new FormData();

      data.append("name", name);
      data.append("image", file);

      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: data,
      });
      if (!response.ok) {
        throw new Error("Failed to upload file");
      }
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <div className="App">
      <h1>PROFILE</h1>
      <form onSubmit={onSubmitHandler}>
        <label htmlFor="name"></label>
        <input
          type="text"
          placeholder="Enter name"
          value={name}
          id="name"
          onChange={HandleOnChange}
        />
        <input type="file" onChange={HandleOnChange} />
        <br />
        <br />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default FileUpload;
