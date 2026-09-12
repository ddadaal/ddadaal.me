CREATE TABLE [VisitEvents] (
	[Id] nvarchar(36),
	[OccurredAt] datetime2(3) NOT NULL CONSTRAINT [VisitEvents_OccurredAt_default] DEFAULT (SYSUTCDATETIME()),
	[SessionId] nvarchar(64) NOT NULL,
	[ArticleId] nvarchar(256) NOT NULL,
	[Path] nvarchar(2048) NOT NULL,
	[Referrer] nvarchar(2048),
	[UtmSource] nvarchar(256),
	[UtmMedium] nvarchar(256),
	[UtmCampaign] nvarchar(256),
	[IpHash] nvarchar(64),
	[Browser] nvarchar(64),
	[OperatingSystem] nvarchar(64),
	[DeviceType] nvarchar(16),
	[IsBot] int NOT NULL CONSTRAINT [VisitEvents_IsBot_default] DEFAULT ((0)),
	[StatusCode] int NOT NULL CONSTRAINT [VisitEvents_StatusCode_default] DEFAULT ((200)),
	[ResponseMs] int NOT NULL,
	CONSTRAINT [VisitEvents_pkey] PRIMARY KEY([Id])
);
--> statement-breakpoint
CREATE INDEX [VisitEvents_Article_Occurred] ON [VisitEvents] ([ArticleId],[OccurredAt]);--> statement-breakpoint
CREATE INDEX [VisitEvents_Session_Occurred] ON [VisitEvents] ([SessionId],[OccurredAt]);