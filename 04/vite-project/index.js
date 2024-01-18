function createDom(type) {
  return {
    type,
  };
}

const fiber = {
  type: "heiheihei",
  dom: null,
};

const dom1 = (fiber.dom = createDom(fiber.type));
console.log(dom1);

const dom2 = (fiber.dom = createDom(fiber.type));
console.log(dom2);
