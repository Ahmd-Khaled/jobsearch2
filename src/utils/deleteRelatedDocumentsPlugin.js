export const deleteRelatedDocumentsPlugin = function (schema, options) {
  schema.pre(
    ["deleteOne", "deleteMany"],
    { document: true, query: true },
    async function (next) {
      try {
        const filter = this.getFilter(); // Get the query filter
        const documents = await this.model.find(filter); // Get documents that match the filter

        if (options?.relatedModels) {
          for (const doc of documents) {
            for (const { model, field } of options.relatedModels) {
              await model.deleteMany({ [field]: doc._id });
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
