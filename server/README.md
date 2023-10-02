# Backend for Chrome Extension Screen Recorder

This backend service provides API endpoints for a Chrome Extension that allows users to record their screens. The recorded videos can be managed through the various endpoints provided by this backend.

## Setup

1. Clone the repository:

   ```
   git clone <https://github.com/ochosteve08/HNG-task5.git>
   ```
2. Install the dependencies:

   ```
   npm install
   ```
3. Start the server:

   ```
   npm run dev
   ```

## API Endpoints

### Video Upload

- **Endpoint**: `/upload`
- **Method**: `POST`
- **Description**: Uploads a video.
- **Payload**: Multipart form data (field name will depend on your frontend's implementation).

### Fetch All Videos

- **Endpoint**: `/`
- **Method**: `GET`
- **Description**: Fetches a list of all uploaded videos.

### Fetch Specific Video

- **Endpoint**: `/:id`
- **Method**: `GET`
- **Description**: Fetches details of a specific video using its unique ID.

### Delete Video

- **Endpoint**: `/:id`
- **Method**: `DELETE`
- **Description**: Deletes a specific video using its unique ID.

## Contributing

For contributions, please create a pull request with a description of the changes made.

---
