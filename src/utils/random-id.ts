function randomId() {
  return (Math.random() + Math.random() + 1).toString(36).substring(2);
}

export default randomId;
