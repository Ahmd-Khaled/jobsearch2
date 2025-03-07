export const deleteRelatedDocumentsPlugin = function (schema, options) {
  schema.pre(
    ["deleteOne", "deleteMany"],
    { document: true, query: true },
    async function (next) {
      try {
        const filter = this.getFilter();
        const documents = await this.model.find(filter);

        if (options?.relatedModels) {
          for (const doc of documents) {
            for (const { model, field } of options.relatedModels) {
              if (doc.deletedAt) {
                await model.updateMany(
                  { [field]: doc._id },
                  { deletedAt: new Date() }
                );
              } else {
                await model.deleteMany({ [field]: doc._id });
              }
            }
          }
        }

        next();
      } catch (err) {
        next(err);
      }
    }
  );
};
