const GITHUB_API_URL = 'https://api.github.com';
const GITHUB_REPO = 'lk153/my-media';
const GITHUB_BRANCH = 'main';
const UPLOAD_FOLDER = 'images';
const CDN_BASE_URL = 'https://img.sachhay.asia';

const getGithubToken = () => {
  return process.env.REACT_APP_GITHUB_TOKEN;
};

const sanitizeFileName = (originalName) => {
  // Replace spaces with hyphens and remove special characters
  return originalName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-_.]/g, '');
};

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const uploadImageToGithub = async (file) => {
  const token = getGithubToken();

  if (!token) {
    throw new Error('GitHub token not configured. Please set REACT_APP_GITHUB_TOKEN.');
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Only JPG, PNG, and SVG are allowed.');
  }

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    throw new Error('File too large. Maximum size is 5MB.');
  }

  const fileName = sanitizeFileName(file.name);
  const filePath = `${UPLOAD_FOLDER}/${fileName}`;
  const base64Content = await fileToBase64(file);

  const response = await fetch(
    `${GITHUB_API_URL}/repos/${GITHUB_REPO}/contents/${filePath}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Upload image: ${fileName}`,
        content: base64Content,
        branch: GITHUB_BRANCH,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to upload image to GitHub');
  }

  const data = await response.json();

  // Return the CDN URL for direct access
  const cdnUrl = `${CDN_BASE_URL}/${filePath}`;

  return {
    url: cdnUrl,
    downloadUrl: data.content?.download_url,
    path: filePath,
    name: fileName,
  };
};
