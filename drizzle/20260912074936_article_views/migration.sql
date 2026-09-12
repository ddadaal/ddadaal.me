CREATE TABLE [ArticleViews] (
	[ArticleId] nvarchar(256),
	[ViewCount] bigint NOT NULL CONSTRAINT [ArticleViews_ViewCount_default] DEFAULT ((0)),
	[LastViewedAt] datetime2(3) NOT NULL CONSTRAINT [ArticleViews_LastViewedAt_default] DEFAULT (SYSUTCDATETIME()),
	CONSTRAINT [ArticleViews_pkey] PRIMARY KEY([ArticleId]),
	CONSTRAINT [ArticleViews_ViewCount_nonnegative] CHECK ([ArticleViews].[ViewCount] >= 0)
);
