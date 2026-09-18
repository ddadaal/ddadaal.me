CREATE TABLE `ArticleViews` (
	`ArticleId` text PRIMARY KEY,
	`ViewCount` text DEFAULT '0' NOT NULL,
	`LastViewedAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	CONSTRAINT "ArticleViews_ViewCount_nonnegative" CHECK(CAST("ViewCount" AS INTEGER) >= 0)
);
--> statement-breakpoint
CREATE TABLE `VisitEvents` (
	`Id` text PRIMARY KEY,
	`OccurredAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`SessionId` text NOT NULL,
	`ArticleId` text NOT NULL,
	`Path` text NOT NULL,
	`Referrer` text,
	`UtmSource` text,
	`UtmMedium` text,
	`UtmCampaign` text,
	`IpHash` text,
	`Browser` text,
	`OperatingSystem` text,
	`DeviceType` text,
	`IsBot` integer DEFAULT false NOT NULL,
	`StatusCode` integer DEFAULT 200 NOT NULL,
	`ResponseMs` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `VisitEvents_Article_Occurred` ON `VisitEvents` (`ArticleId`,`OccurredAt`);--> statement-breakpoint
CREATE INDEX `VisitEvents_Session_Occurred` ON `VisitEvents` (`SessionId`,`OccurredAt`);