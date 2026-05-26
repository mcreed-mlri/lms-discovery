type BrightspaceContentTopic = {
  IsHidden: boolean;
  IsBroken: boolean;
  SortOrder: number;
  TopicId: number;
  Identifier: string;
  TypeIdentifier: string;
  Title: string;
  Url: string | null;
  LastModifiedDate: string;
};

type BrightspaceContentModule = {
  IsHidden: boolean;
  SortOrder: number;
  ModuleId: number;
  Title: string;
  Modules?: BrightspaceContentModule[];
  Topics?: BrightspaceContentTopic[];
};

export type BrightspaceTableOfContents = {
  Modules?: BrightspaceContentModule[];
};

export function summarizeBrightspaceToc(toc: BrightspaceTableOfContents) {
  const modules = toc.Modules || [];

  return modules.map((module) => {
    const topics = (module.Topics || [])
      .filter((topic) => !topic.IsHidden)
      .map((topic) => ({
        topicId: topic.TopicId,
        identifier: topic.Identifier,
        title: topic.Title,
        type: topic.TypeIdentifier,
        url: topic.Url,
        isBroken: topic.IsBroken,
        sortOrder: topic.SortOrder,
        lastModifiedDate: topic.LastModifiedDate,
      }));

    return {
      moduleId: module.ModuleId,
      title: module.Title,
      isHidden: module.IsHidden,
      sortOrder: module.SortOrder,
      topics,
      visibleTopicCount: topics.length,
      usableTopicCount: topics.filter((topic) => topic.url && !topic.isBroken).length,
      brokenTopicCount: topics.filter((topic) => topic.isBroken).length,
    };
  });
}
