import prisma from "../../../../lib/prisma";

export default async function handle(req, res) {
  const { title, content, picture, category, tag, date } = req.body;

  const result = await prisma.blog.findAll({
    data: {
      title: title,
      content: content,
      picture: picture,
      category: category,
      tag: tag,
      date: date,
    },
  });
  res.json(result);
}
