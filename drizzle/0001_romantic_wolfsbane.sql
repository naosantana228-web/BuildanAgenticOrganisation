CREATE TABLE `pipelineArtifacts` (
	`id` varchar(64) NOT NULL,
	`runId` varchar(64) NOT NULL,
	`agentName` varchar(32) NOT NULL,
	`stageOrder` int NOT NULL,
	`inputArtifactIds` text NOT NULL,
	`sourceEvidence` text NOT NULL,
	`assumptions` text NOT NULL,
	`decisionRationale` text NOT NULL,
	`output` text NOT NULL,
	`qualityChecks` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pipelineArtifacts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pipelineRuns` (
	`id` varchar(64) NOT NULL,
	`objective` text NOT NULL,
	`status` enum('queued','running','completed','failed') NOT NULL DEFAULT 'queued',
	`activeAgent` varchar(32),
	`errorMessage` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	CONSTRAINT `pipelineRuns_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `pipelineArtifacts_runId_stageOrder_idx` ON `pipelineArtifacts` (`runId`,`stageOrder`);